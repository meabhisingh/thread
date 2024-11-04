import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { FaImages } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPostModal } from "../../redux/slice";
import { useAddPostMutation } from "../../redux/service";
import Loading from "../common/Loading";
import { Bounce, toast } from "react-toastify";

const AddPost = () => {
  const { openAddPostModal, myInfo } = useSelector((state) => state.service);

  const [addNewPost, addNewPostData] = useAddPostMutation();

  const _700 = useMediaQuery("(min-width:700px)");
  const _500 = useMediaQuery("(min-width:500px)");
  const _300 = useMediaQuery("(min-width:300px)");

  const [text, setText] = useState();
  const [media, setMedia] = useState();

  const mediaRef = useRef();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(addPostModal(false));
  };

  const handleMediaRef = () => {
    mediaRef.current.click();
  };

  const handlePost = async () => {
    const data = new FormData();
    if (text) {
      data.append("text", text);
    }
    if (media) {
      data.append("media", media);
    }
    await addNewPost(data);
  };

  useEffect(() => {
    if (addNewPostData.isSuccess) {
      setText();
      setMedia();
      dispatch(addPostModal(false));
      toast.success(addNewPostData.data.msg, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
    if (addNewPostData.isError) {
     toast.error(addNewPostData.error.data.msg, {
       position: "top-center",
       autoClose: 2500,
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
       theme: "colored",
       transition: Bounce,
     });
    }
  }, [addNewPostData.isSuccess, addNewPostData.isError]);

  return (
    <>
      <Dialog
        open={openAddPostModal}
        onClose={handleClose}
        fullWidth
        fullScreen={_700 ? false : true}
      >
        {addNewPostData?.isLoading ? (
          <Stack height={"60vh"}>
            <Loading />
          </Stack>
        ) : (
          <>
            <Box
              position={"absolute"}
              top={20}
              right={20}
              onClick={handleClose}
            >
              <RxCross2 size={28} className="image-icon" />
            </Box>
            <DialogTitle textAlign={"center"} mb={5}>
              New Thread...
            </DialogTitle>
            <DialogContent>
              <Stack flexDirection={"row"} gap={2} mb={5}>
                <Avatar
                  src={myInfo ? myInfo.profilePic : ""}
                  alt={myInfo ? myInfo.userName : ""}
                />
                <Stack>
                  <Typography
                    variant="h6"
                    fontWeight={"bold"}
                    fontSize={"1rem"}
                  >
                    {myInfo ? myInfo.userName : ""}
                  </Typography>
                  <textarea
                    cols={_500 ? 40 : 25}
                    rows={2}
                    className="text1"
                    placeholder="Start a Thread..."
                    autoFocus
                    onChange={(e) => setText(e.target.value)}
                  />
                  {media ? (
                    <img
                      src={URL.createObjectURL(media)}
                      alt=""
                      id="url-img"
                      width={_500 ? 300 : _300 ? 200 : 100}
                      height={_500 ? 300 : _300 ? 200 : 100}
                    />
                  ) : null}
                  <FaImages
                    size={28}
                    className="image-icon"
                    onClick={handleMediaRef}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input"
                    ref={mediaRef}
                    onChange={(e) => setMedia(e.target.files[0])}
                  />
                </Stack>
              </Stack>
              <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="h6" fontSize={"1rem"} color={"gray"}>
                  Anyone can reply
                </Typography>
                <Button
                  size="large"
                  sx={{
                    bgcolor: "GrayText",
                    color: "white",
                    borderRadius: "10px",
                    ":hover": { bgcolor: "gray", cursor: "pointer" },
                  }}
                  onClick={handlePost}
                >
                  Post
                </Button>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default AddPost;
