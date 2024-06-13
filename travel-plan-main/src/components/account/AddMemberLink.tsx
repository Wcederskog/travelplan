import { ToastContainer, toast } from "react-toastify";

interface AddMemberLinkProps {}

const AddMemberLink: React.FC<AddMemberLinkProps> = ({}) => {
  const notify = () =>
    toast("Invitation link is copied to clipboard", { type: "success" });
  return (
    <div>
      <button
        className="button-reversed text-xs"
        onClick={notify}
        type="button"
      >
        Invitation link
      </button>
      <ToastContainer position="bottom-center" autoClose={3000} />
    </div>
  );
};

export default AddMemberLink;
