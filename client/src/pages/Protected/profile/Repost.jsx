import { Stack, Typography, useMediaQuery } from "@mui/material";
import Post from "../../../components/home/Post";
import { useSelector } from "react-redux";

const Repost = () => {
  const { user } = useSelector((state) => state.service);
  const _700 = useMediaQuery("(min-width:700px)");
  return (
    <>
      {user ? (
        user.user ? (
          user.user.reposts.length > 0 ? (
            <Stack
              flexDirection={"column"}
              gap={2}
              mb={10}
              width={_700 ? "800px" : "90%"}
              mx={"auto"}
            >
              {user.user.reposts.map((e) => {
                return <Post key={e._id} e={e} />;
              })}
            </Stack>
          ) : (
            <Typography textAlign={"center"} variant="h6">
              No Repost yet !
            </Typography>
          )
        ) : (
          <Typography textAlign={"center"} variant="h6">
            No Repost yet !
          </Typography>
        )
      ) : (
        <Typography textAlign={"center"} variant="h6">
          No Repost yet !
        </Typography>
      )}
    </>
  );
};

export default Repost;
