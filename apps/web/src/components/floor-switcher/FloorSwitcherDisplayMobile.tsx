import React, { useEffect, useState } from 'react';
import { Building, Floor } from "@cmumaps/common";
import { motion, StartAnimation, useMotionValue, useTransform, animate } from "framer-motion";

import useBoundStore from "@/store";
import FloorSwitcherCarouselMobile from "./FloorSwitcherCarouselMobile";

interface Props {
  building: Building;
  floor: Floor;
}

const FloorSwitcherDisplayMobile = ({ building, floor } : Props) => {
    const focusFloor = useBoundStore((state) => state.focusFloor);
    const floorIndex = building.floors.indexOf(floor.level);


    // const topFadeText = useAnimation();
    // const topText = useAnimation();
    // const midText = useAnimation();
    // const bottomFadeText = useAnimation();
    // const bottomText = useAnimation();
    // for (var i = 0; i < building.floors.length; i++) {
        

    // }

    // const renderButtons = () => {
    //     building.floors.map((floorLevel, index) => {
        
    //     }
        

    //     return (
    //         <motion.div
    //             className="flex items-center justify-center text-white fixed top-1/2 w-[46px] h-[46px] "
    //             style={{ borderRadius: '50% / 50%', backgroundColor: '#6F8FE3', offsetPath: 'path("M -30,70 L 0,70 A 56,70 0 1,0 0,-70 L -30, -70")', offsetDistance, 
    //                 opacity: useTransform(() => {0}), 
    //                 width, 
    //                 height 
    //             }}
    //             animate={{ offsetDistance: "74%", transition: { duration: 3.0, ease: "easeInOut" } }}
    //             >
    //                  {/* <motion.div  className="fixed" animate={midText}>{building.floors[floorIndex]}</motion.div> */}
    //         </motion.div>
    //     )
    // }


    const renderDownButton = () => {
        const handleClick = () => {
            const floorLevel = building.floors[floorIndex - 1];
            if (floorLevel) {
                focusFloor({ buildingCode: building.code, level: floorLevel });
            }
            // midText.set({x: -18, y: -56});
            // midText.start({x: 0, y: 0, transition: { bounce: 0, duration: 0.5 }});
            // topFadeText.set({opacity: 0});
            // topFadeText.start({opacity: 1, transition: { bounce: 0, duration: 0.5 }});
            // bottomFadeText.set({x: 18, y: -56});
            // bottomFadeText.start({x: 0, y: 0, transition: { bounce: 0, duration: 0.5 }});
            // bottomText.set({opacity: 1});
            // bottomText.start({opacity: 0, transition: { bounce: 0, duration: 0.5 }});
        };

        return floorIndex - 1 >= 0 ?
            (<div
                className="flex items-center justify-center text-white fixed top-1/2 w-[39px] h-[38px] -translate-y-1/2 translate-x-[15px] translate-y-[-75px]"
                style={{ borderRadius: '50% / 50%', backgroundColor: 'rgba(111, 143, 227, 0.5)'}}
                onClick={handleClick}
                >
                    {/* <motion.div className="fixed" animate={topFadeText}>{building.floors[floorIndex - 1]}</motion.div>
                    <motion.div className="fixed" initial={{opacity: 0}} animate={topText}>{floorIndex - 2 >= 0 && building.floors[floorIndex - 2]}</motion.div> */}

            </div>) : 
            (<div
                className="flex items-center justify-center text-white fixed top-1/2 w-[39px] h-[38px] -translate-y-1/2 translate-x-[15px] translate-y-[-75px]"
                style={{ borderRadius: '50% / 50%', backgroundColor: 'rgba(179, 193, 232, 0.5)'}}
                >
                    {/* <motion.div className="fixed" animate={topFadeText}>{building.floors[floorIndex - 1]}</motion.div>
                    <motion.div className="fixed" initial={{opacity: 0}} animate={topText}>{floorIndex - 2 >= 0 && building.floors[floorIndex - 2]}</motion.div> */}
            </div>)
    
    }

    const renderUpButton = () => {
        const handleClick = () => {
            const floorLevel = building.floors[floorIndex + 1];
            if (floorLevel) {
                focusFloor({ buildingCode: building.code, level: floorLevel });
            }
            // midText.set({x: -18, y: 56});
            // midText.start({x: 0, y: 0, transition: { bounce: 0, duration: 0.5 }});
            // bottomFadeText.set({opacity: 0});
            // bottomFadeText.start({opacity: 1, transition: { bounce: 0, duration: 0.5 }});
            // topFadeText.set({x: 18, y: 56});
            // topFadeText.start({x: 0, y: 0, transition: { bounce: 0, duration: 0.5 }});
            // topText.set({opacity: 1});
            // topText.start({opacity: 0, transition: { bounce: 0, duration: 0.5 }});
        };

        return floorIndex + 1 < building.floors.length ?
            (<div
                className="flex items-center justify-center text-white fixed top-1/2 w-[38px] h-[38px] -translate-y-1/2 translate-x-[15px] translate-y-[37px]"
                style={{ borderRadius: '50% / 50%', backgroundColor: 'rgba(111, 143, 227, 0.5)'}}
                onClick={handleClick}
                >
                    {/* <motion.div className="fixed" animate={bottomFadeText}>{building.floors[floorIndex + 1]}</motion.div>
                    <motion.div className="fixed" initial={{opacity: 0}} animate={bottomText}>{floorIndex + 2 < building.floors.length && building.floors[floorIndex + 2]}</motion.div> */}
            </div>) : 
            (<div
                className="flex items-center justify-center text-white fixed top-1/2 w-[38px] h-[38px] -translate-y-1/2 translate-x-[15px] translate-y-[37px]"
                style={{ borderRadius: '50% / 50%', backgroundColor: 'rgba(179, 193, 232, 0.5)'}}
                >
                    {/* <motion.div className="fixed" animate={bottomFadeText}>{floorIndex + 2 < building.floors.length && building.floors[floorIndex + 2]}</motion.div>
                    <motion.div className="fixed" initial={{opacity: 0}} animate={bottomText}>{building.floors[floorIndex]}</motion.div> */}
            </div>)
    
    }

    // const offsetDistance = useMotionValue("0%");
    // // const opacity = useTransform(progress, [0, 1], [0.5, 1]);
    // const opacity = useTransform(() => {
    //     const progress = parseFloat(offsetDistance.get().replace('%', '')) / 100;
    //     return (0.4 < progress && progress < 0.6) ? 1 : 0.5;
    // });
    // const width = useTransform(() => {
    //     const progress = parseFloat(offsetDistance.get().replace('%', '')) / 100;
    //     return (0.4 < progress && progress < 0.6) ? 46 : 38;
    // });
    // const height = useTransform(() => {
    //     const progress = parseFloat(offsetDistance.get().replace('%', '')) / 100;
    //     return (0.4 < progress && progress < 0.6) ? 46 : 38;
    // });
    const progressValue = useMotionValue(floorIndex); // This should be set based on the current progress of the carousel
    // useEffect(() => {
    // const controls = animate(progressValue, building.floors.length, {
    //     duration: 1.5,
    //     ease: "easeInOut",
    // });
    // return controls.stop; // Cleanup on unmount
    // }, []);

    const [startingTouchY, setStartingTouchY] = useState(0);
    const [startingProgressValue, setStartingProgressValue] = useState(0);

    const onTouchStart = (e) => {
        if (e.touches[0]?.clientY) {
            setStartingTouchY(e.touches[0]?.clientY);
            setStartingProgressValue(progressValue.get());
        }
    }


    const onTouchMove = (e) => {
        if (e.touches[0]?.clientY) {
            progressValue.set(Math.max(0, Math.min(building.floors.length - 1, startingProgressValue - (e.touches[0]?.clientY - startingTouchY) / 50)));
            // console.log("dragging: " + (e.touches[0]?.clientY - startingTouchY));
        }
    }

    const onTouchEnd = () => {
        const targetFloorIndex = Math.round(progressValue.get());
        const controls = animate(progressValue, targetFloorIndex, {
            duration: Math.abs(progressValue.get() - targetFloorIndex) * 0.5,
            ease: "easeInOut",
            bounce: 0
        });
        // focusFloor({ buildingCode: building.code, level: floor });
        return controls.stop;
    }

    return (
        <>
            <motion.div
                className="fixed top-1/2 btn-shadow w-[178px] h-[208px] backdrop-blur-md bg-white/10 shadow-lg shadow-black/20 -translate-y-1/2 -translate-x-1/2"
                style={{ borderRadius: '50% / 50%',}}
                // drag={true}
                onTouchStart={(e) => {onTouchStart(e)}}
                onTouchMove={(e) => {onTouchMove(e)}}
                onTouchEnd={() => {onTouchEnd()}}
                >
                    <FloorSwitcherCarouselMobile
                        building={building}
                        progressValue={progressValue}
                    />
            </motion.div>
            
            {/* <div
                className="flex items-center justify-center text-white fixed top-1/2 w-[46px] h-[47px] -translate-y-1/2 translate-x-[33px]"
                style={{ borderRadius: '50% / 50%', backgroundColor: '#6F8FE3'}}
                > */}
                     {/* <motion.div  className="fixed" animate={midText}>{building.floors[floorIndex]}</motion.div> */}
            {/* </div> */}
            {/* <motion.div
                className="flex items-center justify-center text-white fixed top-1/2 w-[46px] h-[46px] "
                style={{ borderRadius: '50% / 50%', backgroundColor: '#6F8FE3', offsetPath: 'path("M -30,70 L 0,70 A 56,70 0 1,0 0,-70 L -30, -70")', offsetDistance, opacity, width, height }}
                animate={{ offsetDistance: "74.52%", transition: { duration: 3.0, ease: "easeInOut" } }}
                > */}
                     {/* <motion.div  className="fixed" animate={midText}>{building.floors[floorIndex]}</motion.div> */}
            {/* </motion.div> */}
            {/* {renderDownButton()} */}
            {/* {renderUpButton()} */}
            
        </>
    )
}

export default FloorSwitcherDisplayMobile;