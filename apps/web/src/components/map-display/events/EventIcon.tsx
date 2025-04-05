import { DetailedEventType } from "@cmumaps/common";

import scottyLabsIcon from "@/assets/carnival/icons/ScottyLabs.png";
import awardsIcon from "@/assets/carnival/icons/award-default.svg";
import awardsIconGray from "@/assets/carnival/icons/award-grey.svg";
import dogHouseIcon from "@/assets/carnival/icons/doghouse-default.svg";
import dogHouseIconGray from "@/assets/carnival/icons/doghouse-grey.svg";
import eventIcon from "@/assets/carnival/icons/event-default.svg";
import eventIconGray from "@/assets/carnival/icons/event-grey.svg";
import exhibitIcon from "@/assets/carnival/icons/exhibit-default.svg";
import exhibitIconGray from "@/assets/carnival/icons/exhibit-grey.svg";
import foodIcon from "@/assets/carnival/icons/food-default.svg";
import foodIconGray from "@/assets/carnival/icons/food-grey.svg";
import healthIcon from "@/assets/carnival/icons/health-default.svg";
import healthIconGray from "@/assets/carnival/icons/health-grey.svg";
import mobotIcon from "@/assets/carnival/icons/mobot-default.svg";
import mobotIconGray from "@/assets/carnival/icons/mobot-grey.svg";
import performanceIcon from "@/assets/carnival/icons/performance-default.svg";
import performanceIconGray from "@/assets/carnival/icons/performance-grey.svg";
import tentIcon from "@/assets/carnival/icons/tent-default.svg";
import tentIconGray from "@/assets/carnival/icons/tent-grey.svg";

interface Props {
  event: DetailedEventType;
}

const EventIcon = ({ event }: Props) => {
  const getIconSrc = (event: DetailedEventType) => {
    // special cases
    if (event.name.includes("ScottyLabs")) {
      return scottyLabsIcon;
    }

    if (event.name.includes("Dog House")) {
      if (new Date(event.startTime) > new Date()) {
        return dogHouseIconGray;
      } else {
        return dogHouseIcon;
      }
    }

    if (event.name.includes("MOBOT")) {
      if (new Date(event.startTime) > new Date()) {
        return mobotIconGray;
      } else {
        return mobotIcon;
      }
    }

    if (event.name.includes("Tent")) {
      if (new Date(event.startTime) > new Date()) {
        return tentIconGray;
      } else {
        return tentIcon;
      }
    }

    // event tracks
    if (event.name.includes("Food")) {
      if (new Date(event.startTime) > new Date()) {
        return foodIconGray;
      } else {
        return foodIcon;
      }
    }

    if (event.name.includes("Awards")) {
      if (new Date(event.startTime) > new Date()) {
        return awardsIconGray;
      } else {
        return awardsIcon;
      }
    }

    if (event.name.includes("Exhibit")) {
      if (new Date(event.startTime) > new Date()) {
        return exhibitIconGray;
      } else {
        return exhibitIcon;
      }
    }

    if (event.tracks.includes("Health/Wellness")) {
      if (new Date(event.startTime) > new Date()) {
        return healthIconGray;
      } else {
        return healthIcon;
      }
    }

    if (event.tracks.includes("Performance")) {
      if (new Date(event.startTime) > new Date()) {
        return performanceIconGray;
      } else {
        return performanceIcon;
      }
    }

    // default
    if (new Date(event.startTime) > new Date()) {
      return eventIconGray;
    } else {
      return eventIcon;
    }
  };

  return (
    <img
      src={getIconSrc(event)}
      alt="Event Pin"
      className="cursor-pointer rounded-full"
      onClick={(e) => e.stopPropagation()}
    />
  );
};

export default EventIcon;
