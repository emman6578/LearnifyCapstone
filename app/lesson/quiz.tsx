"use client";

import { useEffect, useState, useTransition } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { Button } from "@/components/ui/button";
import { MAX_HEARTS } from "@/constants";
import {
  challengeOptions,
  challenges,
  instructionalMaterials,
  userSubscription,
} from "@/db/schema";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card";

type QuizProps = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
    instructionalMaterials: (typeof instructionalMaterials.$inferSelect)[];
  })[];
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialPercentage,
  initialHearts,
  initialLessonId,
  initialLessonChallenges,
  userSubscription,
}: QuizProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [finishAudio] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();
  useMount(() => {
    if (initialPercentage === 100) openPracticeModal();
  });

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );

    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  // const [selectedOption, setSelectedOption] = useState<number>();
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");
  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];

  const [userInput1, setUserInput1] = useState<string>("");
  const [userInput2, setUserInput2] = useState<string>("");

  const [hasLearningMaterial, setHasLearningMaterial] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (challenge && challenge.hasInstructionalMaterials) {
      setHasLearningMaterial(true);
    }
  }, [challenge]);

  const checkUserInput = () => {
    // Make sure both userInput fields are filled
    if (!userInput1 || !userInput2) return;

    // Normalize the inputs and options to lowercase for case-insensitive comparison
    const normalizedUserInput1 = userInput1.trim().toLowerCase();
    const normalizedUserInput2 = userInput2.trim().toLowerCase();

    // Filter the challengeOptions that match the user inputs
    const matchingOptions = challenge.challengeOptions.filter(
      (option) =>
        (option.text.trim().toLowerCase() === normalizedUserInput1 ||
          option.text.trim().toLowerCase() === normalizedUserInput2) &&
        option.correct
    );

    // If there are matching options, update the selectedOptions array with their IDs
    if (matchingOptions.length > 0) {
      const matchingIds = matchingOptions.map((option) => option.id);
      setDisableButton(true);
      setSelectedOptions(matchingIds); // Update the selectedOptions state
    } else {
      setDisableButton(true);
      setSelectedOptions([45, 46]); // If no match, reset selectedOptions
    }
  };

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;

    // Toggle the selection
    setSelectedOptions(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((optionId) => optionId !== id) // Deselect if already selected
          : [...prevSelected, id] // Add to the array if not selected
    );
  };

  const onContinue = () => {
    if (selectedOptions.length === 0) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOptions([]);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOptions([]);
      return;
    }

    const correctOptions = options
      .filter((option) => option.correct)
      .map((option) => option.id);

    if (!correctOptions || correctOptions.length === 0) return;

    // Check if the selected options match the correct options
    const isCorrect =
      selectedOptions.length === correctOptions.length &&
      selectedOptions.every((id) => correctOptions.includes(id));

    if (isCorrect) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            setDisableButton(false);
            setUserInput1("");
            setUserInput2("");

            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            void correctControls.play();
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // This is a practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, MAX_HEARTS));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            setDisableButton(false);
            setUserInput1("");
            setUserInput2("");

            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }

            void incorrectControls.play();
            setStatus("wrong");

            if (!response?.error) setHearts((prev) => Math.max(prev - 1, 0));
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };

  if (!challenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10_000}
          width={width}
          height={height}
        />
        <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center gap-y-4 text-center lg:gap-y-8">
          <Image
            src="/finish.svg"
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />

          <Image
            src="/finish.svg"
            alt="Finish"
            className="block lg:hidden"
            height={100}
            width={100}
          />

          <h1 className="text-lg font-bold text-neutral-700 lg:text-3xl">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>

          <div className="flex w-full items-center gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard
              variant="hearts"
              value={userSubscription?.isActive ? Infinity : hearts}
            />
          </div>
        </div>

        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const handleHasLearningMaterial = () => {
    setHasLearningMaterial(false);
  };

  const title =
    challenge.type === "ASSIST"
      ? "Select the correct meaning"
      : challenge.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />

      <div className="flex-1">
        <div className="flex h-full items-center justify-center">
          <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
            {challenge.type === "ASSIST" && (
              <QuestionBubble question={challenge.question} />
            )}

            {hasLearningMaterial ? (
              <>
                <div className="instructional-materials rounded-lg bg-gradient-to-br from-yellow-100 to-pink-100 p-4 shadow-lg">
                  {challenge.instructionalMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="material-item mb-6 transform rounded-2xl border-4 border-blue-300 bg-white p-4 shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                    >
                      <h2 className="mb-3 text-2xl font-extrabold text-purple-700">
                        {material.title}
                      </h2>
                      <p className="mb-4 text-lg font-semibold text-pink-600">
                        {material.description}
                      </p>
                      <div
                        className="content rounded-lg border border-purple-200 bg-purple-50 p-3 text-base leading-relaxed text-gray-800"
                        dangerouslySetInnerHTML={{
                          __html: material.content ?? "",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex w-full flex-col gap-y-12 px-6 lg:min-h-[350px] lg:w-[600px] lg:px-0">
                  <h1
                    className="text-center text-lg font-bold text-neutral-700 lg:text-2xl"
                    dangerouslySetInnerHTML={{
                      __html: challenge.instructions ?? "",
                    }}
                  />
                  <h1
                    className="text-center text-lg font-bold text-neutral-700 lg:text-start lg:text-3xl"
                    dangerouslySetInnerHTML={{
                      __html: title ?? "",
                    }}
                  />

                  {challenge.type === "UNDERLINED" && (
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-green-100 p-6 shadow-lg">
                      {status === "correct" ? (
                        <>{status === "correct" && <h1>Very good!</h1>}</>
                      ) : (
                        <div className="flex flex-col gap-y-6">
                          <input
                            type="text"
                            value={userInput1}
                            onChange={(e) => setUserInput1(e.target.value)}
                            placeholder="Type your first word..."
                            className="rounded-xl border-2 border-blue-300 bg-white p-3 text-lg shadow-sm transition-all duration-300 focus:border-yellow-400 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={userInput2}
                            onChange={(e) => setUserInput2(e.target.value)}
                            placeholder="Type your second word..."
                            className="rounded-xl border-2 border-blue-300 bg-white p-3 text-lg shadow-sm transition-all duration-300 focus:border-yellow-400 focus:outline-none"
                          />

                          <div className="mb-10 flex justify-center">
                            {disableButton ? (
                              <></>
                            ) : (
                              <Button
                                className="w-1/2"
                                variant={"primary"}
                                onClick={checkUserInput}
                              >
                                Submit to Check
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {challenge.type === "SELECT" && (
                    <Challenge
                      options={options}
                      onSelect={onSelect}
                      status={status}
                      selectedOption={selectedOptions}
                      disabled={pending}
                      type={challenge.type}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {hasLearningMaterial ? (
        <div className="mb-10 flex justify-center">
          <Button
            className="w-1/2"
            variant={"primary"}
            onClick={handleHasLearningMaterial}
          >
            Next
          </Button>
        </div>
      ) : (
        <Footer
          disabled={pending || !selectedOptions}
          status={status}
          onCheck={onContinue}
        />
      )}
    </>
  );
};
