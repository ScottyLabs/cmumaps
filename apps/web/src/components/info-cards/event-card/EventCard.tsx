interface Props {
  eventId: string;
}

const EventCard = ({ eventId }: Props) => {
  return <div>{eventId}</div>;
};

export default EventCard;
