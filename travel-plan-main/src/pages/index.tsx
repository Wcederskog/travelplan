import { NextPage } from "next";
import Layout from "../containers/Layout";
import Image from "next/image";
import Link from "next/link";

const Index: NextPage = () => {
  const cardText = [
    {
      title: "Route Planning",
      description:
        "Effortlessly plot your route with precision using our advanced mapping tools. Plan every step of your journey to ensure you never miss a beat.",
      img: require("../assets/images/route-planning.png"),
    },
    {
      title: "Coordinate your trip with friends and family",
      description:
        "With TravelPlan, it's easy to coordinate your trip with friends and family.",
      img: require("../assets/images/plan-with-friends.png"),
    },
    {
      title: "Customizable Plan",
      description:
        "Tailor your journey to suit your interests. Add multiple stops for sightseeing, dining, shopping, and more.",
      img: require("../assets/images/customizable-plan.png"),
    },
  ];

  return (
    <Layout title="TravelPlan - Welcome!">
      <div className="relative flex items-center h-[100vh]">
        <Image
          className="absolute inset-0 -z-10 w-full h-full object-cover opacity-50"
          alt="pinmap"
          src={require("../assets/images/hero-image.png")}
        />
        <section className="grid-responsive mb-28">
          <div className="col-span-full lg:col-span-7 text-center lg:text-left flex gap-4 flex-col">
            <h1>Map Your Journey</h1>
            <h4 className="lg:w-4/5">
              Create your customized interactive route with our intuitive
              mapping tool
            </h4>
            <p></p>
          </div>
        </section>
      </div>
      <section className="grid-responsive py-28" id="how-it-works">
        <div className="col-span-full text-center md:text-left md:col-start-2 md:col-span-5 flex flex-col justify-center gap-3">
          <h2>TravelPlan</h2>
          <p>
            TravelPlan is your go-to platform for planning the perfect vacation.
            Whether you&apos;re dreaming of a solo adventure, a family getaway,
            or a trip with friends, our interactive tools make it easy to
            organize every detail of your journey.
          </p>
          <Link
            href={"/travelplan"}
            className="button-default mx-auto md:mx-0 mt-4"
          >
            Get started
          </Link>
        </div>
        <div className="hidden md:block col-start-8 col-span-4">
          <Image
            alt="pinmap"
            height={500}
            width={500}
            src={require("../assets/images/pinmap.png")}
          />
        </div>
      </section>
      <section className="grid-responsive py-28" id="why-travelplan">
        <div className="col-span-full  flex flex-col justify-center gap-8">
          <h2 className="text-center">Why TravelPlan</h2>
          <div className="gap-14 grid grid-cols-4 md:grid-cols-12">
            {cardText.map((item, index) => (
              <div
                className="flex md:col-span-4 col-span-full items-center flex-col text-center gap-5"
                key={index}
              >
                <Image src={item.img} width={310} height={310} alt="pinmap" />
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href={"/travelplan"} className="button-default mt-4 mx-auto">
            Get started
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
