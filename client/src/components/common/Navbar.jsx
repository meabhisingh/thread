import { Stack, useMediaQuery } from "@mui/material";
import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { CiHeart } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPostModal } from "../../redux/slice";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { darkMode, myInfo } = useSelector((state) => state.service);

  const _300 = useMediaQuery("(min-width:300px)");
  const _700 = useMediaQuery("(min-width:700px)");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showArrow, setShowArrow] = useState(false);

  const checkArrow = () => {
    if (window.location.pathname.includes("/post/") && _700) {
      setShowArrow(true);
      return;
    }
    setShowArrow(false);
  };

  const handleAddPost = () => {
    dispatch(addPostModal(true));
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  useEffect(() => {
    checkArrow();
  }, [window.location.pathname]);

  return (
    <>
      <Stack
        flexDirection={"row"}
        maxWidth={"100%"}
        justifyContent={"space-around"}
        alignItems={"center"}
      >
        {showArrow ? (
          <FiArrowLeft
            size={_300 ? 32 : 24}
            className="image-icon"
            onClick={handleNavigate}
            color={darkMode ? "white" : "black"}
          />
        ) : null}
        <Link to={"/"} className="link">
          <GoHome size={_300 ? 32 : 24} color={darkMode ? "white" : "black"} />
        </Link>
        <Link to={"/search"} className="link">
          <IoIosSearch
            size={_300 ? 32 : 24}
            color={darkMode ? "white" : "black"}
          />
        </Link>
        <TbEdit
          size={_300 ? 32 : 24}
          className="image-icon"
          color={darkMode ? "white" : "black"}
          onClick={handleAddPost}
        />
        <CiHeart size={_300 ? 32 : 24} color={darkMode ? "white" : "black"} />
        <Link to={`/profile/threads/${myInfo?._id}`} className="link">
          <RxAvatar
            size={_300 ? 32 : 24}
            color={darkMode ? "white" : "black"}
          />
        </Link>
      </Stack>
    </>
  );
};

export default Navbar;
