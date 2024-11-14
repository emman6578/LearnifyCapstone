import {
  BooleanInput,
  Edit,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";

export const ChallengeEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="question" validate={[required()]} label="Question" />
        <TextInput
          source="instructions"
          validate={[required()]}
          label="Instructions"
        />
        <SelectInput
          source="type"
          validate={[required()]}
          choices={[
            {
              id: "SELECT",
              name: "SELECT",
            },
            {
              id: "ASSIST",
              name: "ASSIST",
            },
            {
              id: "UNDERLINED",
              name: "UNDERLINED",
            },
          ]}
        />
        <ReferenceInput source="lessonId" reference="lessons" />
        <NumberInput source="order" validate={required()} label="Order" />
        <BooleanInput
          source="hasInstructionalMaterials"
          label="Has Instructional Materials"
        />
      </SimpleForm>
    </Edit>
  );
};
