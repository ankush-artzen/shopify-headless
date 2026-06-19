// import '@shopify/ui-extensions/preact';
// import {render} from "preact";
// import {useEffect, useState} from "preact/hooks";

// const TRI_FERG_MARKS = [
//   {id: "grey", src: "https://cdn.shopify.com/s/files/1/0305/3289/files/tri-ferg-grey.png?v=1712657968&width=46"},
//   {id: "blue", src: "https://cdn.shopify.com/s/files/1/0305/3289/files/tri-ferg-blue.png?v=1712657968&width=46"},
//   {id: "red", src: "https://cdn.shopify.com/s/files/1/0305/3289/files/tri-ferg-red.png?v=1712657969&width=46"},
// ];

// function shuffleMarks(items) {
//   const next = [...items];
//   for (let i = next.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [next[i], next[j]] = [next[j], next[i]];
//   }
//   return next;
// }

// // 1. Export the extension
// export default async () => {
//   render(<Extension />, document.body)
// };

// function Extension() {
//   const [marks, setMarks] = useState(TRI_FERG_MARKS);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMarks(shuffleMarks(TRI_FERG_MARKS));
//     }, 900);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <s-banner heading="TRI FERG">
//       <s-stack gap="base">
//         {marks.map((mark) => (
//           <s-image
//             key={mark.id}
//             src={mark.src}
//             alt={mark.id}
//             inlineSize="auto"
//           />
//         ))}
//       </s-stack>
//     </s-banner>
//   );
// }
import '@shopify/ui-extensions/preact';
import {render} from "preact";
import {useEffect, useState} from "preact/hooks";
import {getContinueShoppingUrl} from './constants.js';

const TRI_FERG_MARKS = [
  {
    id: "grey",
    src: "https://cdn.shopify.com/s/files/1/0305/3289/files/tri-ferg-grey_80x80.png?v=1712657968",
  },
  {
    id: "red",
    src: "https://cdn.shopify.com/s/files/1/0305/3289/files/tri-ferg-red_80x80.png?v=1712657969",
  },
  {
    id: "blue",
    src: "https://cdn.shopify.com/s/files/1/0305/3289/files/tri-ferg-blue_80x80.png?v=1712657968",
  },
];

function shuffleMarks(items) {
  const next = [...items];

  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
}

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const [marks, setMarks] = useState(TRI_FERG_MARKS);
  const storefrontUrl = getContinueShoppingUrl();

  useEffect(() => {
    const interval = setInterval(() => {
      setMarks(shuffleMarks(TRI_FERG_MARKS));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <s-stack
      direction="inline"
      gap="small"
      inlineSize="100%"
      blockSize="auto"
      justifyContent="center"
      alignItems="center"
      padding="none"
      paddingBlock="none"
      paddingInline="none"
    >
      {marks.map((mark) => (
        <s-clickable
          key={mark.id}
          href={storefrontUrl}
          target="_blank"
          accessibilityLabel={`Visit demo store - ${mark.id}`}
        >
          <s-image src={mark.src} alt={mark.id} inlineSize="auto" />
        </s-clickable>
      ))}
    </s-stack>
  );
}