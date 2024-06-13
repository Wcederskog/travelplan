//@ts-nocheck
import React from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface LayoutProps {
  children?: JSX.Element | JSX.Element[];
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image:alt" content="Logo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="scroll-smooth">
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default Layout;
