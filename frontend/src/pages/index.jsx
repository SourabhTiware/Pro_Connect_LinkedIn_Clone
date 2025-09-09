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

              <div className={styles.heroHeading}>
                  <p>Connect, collaborate, and grow with ProConnect — a next-gen platform designed to help professionals build meaningful networks and unlock new opportunities.</p>
              </div>

               

               <div onClick={() =>{router.push("/login")}} className={styles.buttonJoin}>

                    <p>Join Now !</p>
               </div>
          </div>

          <div className={styles.maincontainer_right}>
            <img src="images/ProConnect Image.png" alt="" />
          </div>

        </div>

      </div>
    </UserLayout>
  );
}
