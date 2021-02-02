import React from "react";
import { firebase } from "./firebase";
import { useDropzone } from "react-dropzone";
import { Grid, Typography, Button } from "@material-ui/core";

export default function ImagesDropzone({ setImageList }) {
   const onDrop = (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
         const newImages = Array.from(acceptedFiles).map((file) => {
            return {
               file: file,
               fileName: file.name,
               status: "CREATED",
               storageRef: firebase.storage().ref().child(file.name),
               downloadURL: "",
               description: "",
            };
         });

         setImageList((prevState) => [...prevState, ...newImages]);
      }
   };

   const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop,
      accept: "image/png, image/jpeg",
      noClick: true,
      noKeyboard: true,
   });

   return (
      <div {...getRootProps()}>
         <input {...getInputProps()} />
         <Grid container direction="column" spacing={2}>
            <Grid
               item
               container
               direction="column"
               alignItems="center"
               spacing={1}
            >
               <Grid item>
                  <Typography align="center">
                     {isDragActive
                        ? "Drop Images here ..."
                        : "Drag 'n' drop Images here, or:"}
                  </Typography>
               </Grid>
               <Grid item>
                  <Button onClick={open} variant="contained" color="primary">
                     Select Images...
                  </Button>
               </Grid>
            </Grid>
         </Grid>
      </div>
   );
}
