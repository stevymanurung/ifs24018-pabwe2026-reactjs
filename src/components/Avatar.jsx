import { assetUrl } from "../helpers/apiHelper";

export default function Avatar({ name, photo, className = "h-9 w-9" }) {
  return photo ? (
    <img src={assetUrl(photo)} alt={name} className={`${className} rounded-full object-cover`} />
  ) : (
    <span
      className={`${className} inline-flex items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700`}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
