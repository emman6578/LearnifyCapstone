import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
} from "react-admin";

export const InstructionalMaterialsList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <NumberField source="id" />
        <TextField source="title" />
        <TextField source="description" />
        <TextField source="content" />
        <ReferenceField source="challengeId" reference="challenges" />
        <TextField src="imageSrc" />
        <TextField src="audioSrc" />
      </Datagrid>
    </List>
  );
};
