const SIZE = {
  cx: 13,
  cy: 13,
};

function Distribution(props) {
  let classNames = "symbol";
  if (props.large) {
    classNames += " large";
  }

  return (
    <svg
      className={classNames}
      viewBox="0 0 26 26"
      fill="none"
      aria-hidden="true"
      data-dist={props.dist}
    >
      <circle
        fill="currentColor"
        r="4"
        {...SIZE}
        style={{ fill: "var(--color-dist1, currentColor)" }}
      />
      <circle
        stroke="currentColor"
        r="6.5"
        {...SIZE}
        style={{ stroke: "var(--color-dist2, currentColor)" }}
      />
      <circle
        stroke="currentColor"
        r="9.5"
        {...SIZE}
        style={{ stroke: "var(--color-dist3, currentColor)" }}
      />
      <circle
        stroke="currentColor"
        r="12.5"
        {...SIZE}
        style={{ stroke: "var(--color-dist4, currentColor)" }}
      />
    </svg>
  );
}

export { Distribution };
