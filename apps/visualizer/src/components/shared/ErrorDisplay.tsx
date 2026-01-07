interface Props {
  errorText: string;
}

const ErrorDisplay = ({ errorText }: Props) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
      <p className="text-nowrap text-3xl text-red-500">
        {errorText}! Check the Console for detailed error!
      </p>
    </div>
  );
};

export default ErrorDisplay;
