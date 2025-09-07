import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/Layout/UserLayout";


const inter = Inter({subsets: ["latin"] });

export default function Home() {

const router = useRouter();

  return (
    <UserLayout>
      <div className={styles.container}>

        <div className= {styles.mainContainer}>

          <div className={styles.mainContainer_left}>

               <p>Connect With Frindeds with Exaggeration</p>

               <p>A true social media platform, with stories no blufs i d;lkfjdslf</p>

               <div onClick={() =>{router.push("/login")}} className={styles.buttonJoin}>

                    <p>Join Now !</p>
               </div>
          </div>

          <div className={styles.maincontainer_right}>
            <img src="images/homeConnection.jpg" alt="" />
          </div>

        </div>

      </div>
    </UserLayout>
  );
}
