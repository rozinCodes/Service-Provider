// import React from "react";
// import { View, Text } from "react-native";
// import Input from "../components/input";
// import * as Yup from "yup";
// import { useFormik } from "formik";
// import { firebase } from "../components/configuration/config";
// import Button from "../components/button";

// const Create = () => {

//     const schema = Yup.object().shape({
//         item: Yup.string().trim().required("Please enter your name"),
//       });
    
//       const formik = useFormik({
//         initialValues: {
//           item: "",
//         },
//         validationSchema: schema,
//         onSubmit: (values) => {
//           const item = values.item.trim();

//           const employeeData = {
//             userId: user.uid,
//             item
//           };
//           const usersRef = firebase.firestore().collection("test");
//           setLoading(true);
    
//           usersRef.add(employeeData).catch((err) => {
//             showMessage({
//               message: "Oops",
//               description: err.message,
//               type: "danger",
//             });
//           });
//           setLoading(false);
//         },
//       });
//   const itemError = formik.errors.item && formik.touched.item;

//   return (
//     <View style={{marginHorizontal: 20 }}>
//       <Input
//         placeholder="Enter something"
//         textTitle="Age"
//         textTitleColor={itemError && "#D16969"}
//         borderColor={itemError && "#D16969"}
//         borderWidth={itemError && 2}
//         onchangeText={formik.handleChange("item")}
//         customStyle={{ borderBottomWidth: 0 }}
//         onBlur={formik.handleBlur("item")}
//       />
//       {formik.errors.item && formik.touched.item && (
//         <Text style={{ color: "#D16969", marginTop: 8 }}>
//           {formik.errors.item}
//         </Text>
//       )}
//       <Button
//         disabled={!(formik.isValid && formik.dirty)}
//         onPress={formik.handleSubmit}
//         title="Create"
//       />
//     </View>
//   );
// };

// export default Create;
