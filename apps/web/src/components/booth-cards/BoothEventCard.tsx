interface Props {
  boothType: string;
  horizontal: boolean;
  name: string;
  orgType: string;
  theme: string;
}

const ORG_TAG_STYLES: Record<string, string> = {
  club: "bg-[#DDEEFF] text-[#0093E0]",
  fraternity: "bg-[#E4D7FA] text-[#5B3CB7]",
  sorority: "bg-[#FFE3D7] text-[#E35A1C]",
};

const BoothEventCard = ({
  boothType,
  horizontal,
  name,
  orgType,
  theme,
}: Props) => {
  const renderBadge = (label: string, className: string) => (
    <span className={`rounded-md px-2 py-1 font-bold text-sm ${className}`}>
      {label}
    </span>
  );

  return (
    <article
      className={`rounded-2xl border border-stroke-neutral-1 bg-white p-3 shadow-sm ${horizontal ? "min-w-[300px]" : ""}`}
    >
      <div className="mb-2 flex gap-2">
        {renderBadge(boothType, "bg-[#FFE3D7] text-[#E35A1C]")}
        {renderBadge(
          orgType,
          ORG_TAG_STYLES[orgType.toLowerCase()] ?? "bg-gray-100 text-gray-700",
        )}
      </div>
      <h3 className="leading-tight">{name}</h3>
      <p className="mt-1 text-gray-500">Theme: {theme}</p>
    </article>
  );
};

export { BoothEventCard };
