import loading from "../assets/img/loading.gif";

const LoadingGif = () => {
  return (
    <div className="flex justify-center items-center">
      <img src={loading} alt="Loading..." className="w-10 h-10" />
    </div>
  );
};

export default LoadingGif;
