interface Props {
  lowerHeight: number;
}

const CoursesMenu = ({ lowerHeight }: Props) => (
  <div
    className="btn-shadow-dark fixed inset-x-5 z-50 overflow-auto rounded-lg bg-white shadow-lg"
    style={{ bottom: lowerHeight }}
  >
    <div className="w-full py-2 text-center font-bold text-xl">Schedule</div>
    <div className="w-full justify-center px-2 py-2 text-lg">
      Integration with course schedules from{" "}
      <a
        href="https://cmucourses.com"
        target="_blank"
        rel="noreferrer"
        className="text-primary-blue underline"
      >
        CMU Courses
      </a>{" "}
      is in development.
    </div>
  </div>
);

export { CoursesMenu };
