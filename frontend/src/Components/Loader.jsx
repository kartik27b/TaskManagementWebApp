import React from "react";
import Lottie from "react-lottie";
import LoadingLottie from "../extras/loading_lottie.json";
import BounceLoader from "react-spinners/BounceLoader";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="player">
      <Lottie options={defaultOptions} height={400} width={400} />
      {/* <BounceLoader size={200}></BounceLoader> */}
    </div>
  );
};

export default Loader;
