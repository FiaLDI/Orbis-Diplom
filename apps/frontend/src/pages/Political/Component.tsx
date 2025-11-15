import React, { useState } from "react";
import Article from "./components/Article";
import { ArticleNavigator } from "./components/ArticleNavigator";
import { article } from "@/utils/articles";

export const Component: React.FC = () => {
  const [order, setOrder] = useState(0);

  return (
    <div className="p-10 bg-[rgba(0,0,0,0.3)]">
      <ArticleNavigator navigate={setOrder} order={order} />
      <Article
        title={article[order].title}
        description={article[order].description}
        content={article[order].content}
      />
    </div>
  );
};
