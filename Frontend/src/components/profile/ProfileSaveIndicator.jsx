export default function ProfileSaveIndicator({
  saved,
}) {
  if (!saved) return null;

  return (
    <div
      className="
        bg-green-50
        border
        border-green-200
        rounded-lg
        px-4
        py-3
      "
    >
      <p className="text-green-700 font-medium">
        Profile saved successfully.
      </p>
    </div>
  );
}