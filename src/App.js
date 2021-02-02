import React, { useState, useEffect } from "react";

import { Grid, Box } from "@material-ui/core";

import ImagesDropzone from "./imagesDropzone";
import ImageElement from "./imageElement";

export default function App() {
   const [imageList, setImageList] = useState([]);

   const changeImageField = (index, parameter, value) => {
      const newArray = [...imageList];
      newArray[index][parameter] = value;
      setImageList(newArray);
   };

   const handleChangeOrderUp = (index) => {
      // If first, ignore
      if (index !== 0) {
         const newArray = [...imageList];
         const intermediate = newArray[index - 1];
         newArray[index - 1] = newArray[index];
         newArray[index] = intermediate;
         setImageList(newArray);
      }
   };

   const handleChangeOrderDown = (index) => {
      // If last, ignore
      if (index < imageList.length - 1) {
         const newArray = [...imageList];
         const intermediate = newArray[index + 1];
         newArray[index + 1] = newArray[index];
         newArray[index] = intermediate;
         setImageList(newArray);
      }
   };

   const handleDeleteImage = (index) => {
      imageList[index].storageRef
         .delete()
         .then(() => {
            const newArray = [...imageList];
            newArray.splice(index, 1);
            setImageList(newArray);
         })
         .catch((error) => {
            console.log("Error deleting file:", error);
         });
   };

   useEffect(() => {
      imageList.forEach((image, index) => {
         if (image.status === "FINISH" || image.status === "UPLOADING") return;
         changeImageField(index, "status", "UPLOADING");
         const uploadTask = image.storageRef.put(image.file);
         uploadTask.on(
            "state_changed",
            null,
            function error(err) {
               console.log("Error Image Upload:", err);
            },
            async function complete() {
               const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
               changeImageField(index, "downloadURL", downloadURL);
               changeImageField(index, "status", "FINISH");
            }
         );
      });
   });

   return (
      <Grid container direction="column" alignItems="center" spacing={2}>
         <Box border={1} margin={4} padding={3}>
            <Grid
               item
               container
               direction="column"
               alignItems="center"
               xs={12}
               spacing={1}
            >
               <Grid item container xs={12} justify="center">
                  <ImagesDropzone setImageList={setImageList} />
               </Grid>
            </Grid>
         </Box>
         {imageList.length > 0 && (
            <Box bgcolor="primary.light" p={4}>
               {imageList.map((image, index) => {
                  return (
                     <Grid item key={image.file.size + index}>
                        <ImageElement
                           image={image}
                           index={index}
                           isFirstElement={index === 0}
                           isLastElement={index === imageList.length - 1}
                           handleChangeOrderUp={handleChangeOrderUp}
                           handleChangeOrderDown={handleChangeOrderDown}
                           handleDeleteImage={handleDeleteImage}
                           changeImageField={changeImageField}
                        />
                     </Grid>
                  );
               })}
            </Box>
         )}
      </Grid>
   );
}
