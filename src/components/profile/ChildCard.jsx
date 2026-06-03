export default function ChildCard({
  child,
  index,
  profile,
  setProfile,
}) {
  const updateChild = (
    field,
    value
  ) => {
    const updated = [
      ...profile.children,
    ];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setProfile({
      ...profile,
      children: updated,
    });
  };

  return (
    <div className="border rounded-xl p-5">
      <h3 className="font-semibold mb-4">
        Child {index + 1}
      </h3>

      <div className="grid md:grid-cols-2 gap-4">

        <div>
          <label className="block mb-2 font-medium">
            Name
          </label>

          <input
            type="text"
            value={child.name}
            onChange={(e) =>
              updateChild(
                "name",
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Age
          </label>

          <input
            type="number"
            min="0"
            max="30"
            value={child.age}
            onChange={(e) =>
              updateChild(
                "age",
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Education
          </label>

          <input
            type="number"
            min="0"
            value={child.education}
            onChange={(e) =>
              updateChild(
                "education",
                Number(
                  e.target.value
                ) || 0
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Allowance
          </label>

          <input
            type="number"
            min="0"
            value={child.allowance}
            onChange={(e) =>
              updateChild(
                "allowance",
                Number(
                  e.target.value
                ) || 0
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Holiday Budget
          </label>

          <input
            type="number"
            min="0"
            value={child.holiday}
            onChange={(e) =>
              updateChild(
                "holiday",
                Number(
                  e.target.value
                ) || 0
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Medical
          </label>

          <input
            type="number"
            min="0"
            value={child.medical}
            onChange={(e) =>
              updateChild(
                "medical",
                Number(
                  e.target.value
                ) || 0
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>
    </div>
  );
}