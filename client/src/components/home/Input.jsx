import {
  Avatar,
  Button,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addPostModal } from "../../redux/slice";

const Input = () => {
  const { myInfo } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");

  const dispatch = useDispatch();

  const handleAddPost = () => {
    dispatch(addPostModal(true));
  };

  return (
    <>
      {_700 ? (
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          width={"70%"}
          height={28}
          justifyContent={"space-between"}
          p={3}
          borderBottom={"2px solid gray"}
          my={5}
          mx={"auto"}
          onClick={handleAddPost}
        >
          <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
            <Avatar
              src={myInfo ? myInfo.profilePic : ""}
              alt={myInfo ? myInfo.userName : ""}
            />
            <Typography color={"GrayText"}> Start a thread...</Typography>
          </Stack>
          <Button
            size="medium"
            sx={{
              bgcolor: "gray",
              color: "aliceblue",
              ":hover": {
                bgcolor: "black",
                cursor: "pointer",
              },
            }}
          >
            POST
          </Button>
        </Stack>
      ) : null}
    </>
  );
};

export default Input;
