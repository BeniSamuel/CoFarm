import imageNotification from "../../assets/Notification.svg";

const Notifications = () => {
  const notificationAvailable = null;
  return (
    <div className=" flex flex-col gap-1 w-[25vw]">
      <div className=" text-sm font-semibold">Notifications</div>
      <div className=" bg-[#c2f0bb] h-80 rounded-lg">
        {notificationAvailable === null ? (
          <div className=" flex flex-col items-center">
            <img src={imageNotification} />
            <p className=" text-sm text-green-700">No availabe Notifications</p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Notifications;
