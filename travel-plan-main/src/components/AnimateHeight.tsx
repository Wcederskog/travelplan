import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface Props {
  isVisible: boolean;
  children?: React.ReactNode;
  delayInMS?: number;
  duration?: number;
}

const AnimateHeight: React.FC<Props> = ({
  isVisible,
  children,
  delayInMS,
  duration,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(isVisible);
    }, delayInMS);
  }, [isVisible, delayInMS]);

  const variants = {
    open: {
      opacity: 1,
      height: "auto",
      x: 0,
    },
    collapsed: { opacity: 0, height: 0, x: 0 },
  };

  return (
    <motion.div
      className="overflow-hidden"
      initial={visible ? "open" : "collapsed"}
      animate={visible ? "open" : "collapsed"}
      inherit={false}
      variants={variants}
      transition={{ duration: duration ?? 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateHeight;
