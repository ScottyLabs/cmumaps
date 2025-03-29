interface Props {
  url: string;
  alt: string;
}

const InfoCardImage = ({ url, alt }: Props) => {
  return (
    // we need this div to maintain the size of the image
    <div className="h-36">
      <div className="relative h-36">
        <img className="object-cover" alt={alt} src={url} />
      </div>
    </div>
  );
};

export default InfoCardImage;
