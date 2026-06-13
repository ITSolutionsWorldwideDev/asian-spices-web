import Homei from "@/components/layout/home/Home";
import { error } from "console";

// import Image, { type ImageProps } from "next/image";
// import { Button } from "@repo/ui/button";
// import styles from "./page.module.css";

// type Props = Omit<ImageProps, "src"> & {
//   srcLight: string;
//   srcDark: string;
// };

// const ThemeImage = (props: Props) => {
//   const { srcLight, srcDark, ...rest } = props;

//   return (
//     <>
//       <Image {...rest} src={srcLight} className="imgLight" />
//       <Image {...rest} src={srcDark} className="imgDark" />
//     </>
//   );
// };

export default function Home() {
  // const res = await fetch("https://ipapi.co/json/", {
  //   cache: "no-store", // important for fresh IP data
  // });

  // if (!res.ok) {
  //   const errorText = await res.text(); // Get the HTML to see what the error is
  //   console.error(`Error ${res.status}:`, errorText);
  //   return;
  // }
  // const data = await res.json();
  // console.log(data);

  return (
    <div>
      {/* <p>{data.ip}</p> */}
      <Homei />
    </div>
  );
}
