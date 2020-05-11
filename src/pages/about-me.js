import React from "react";
import { graphql } from "gatsby";

import Layout from "components/templates/layout";
import SEO from "components/seo";

const CareerTimeline = () => {
    return (
        <div>
            <h1>Career Timeline</h1>
            <h2>Hamee</h2>
            2020/04~現在
            <h2>DaVinciStudio</h2>
            2019/12~2020/03
            <h2>みんなのウェディング</h2>
            2016/09~2019/11
            <h2>日立システムズ</h2>
            2014/04~2016/08
        </div>
    );
};

class AboutMe extends React.Component {
    render() {
        const { data, location } = this.props;
        const { title } = data.site.siteMetadata;

        return (
            <Layout location={location} title={title}>
                <SEO
                    title={title}
                    keywords={[`blog`, `gatsby`, `javascript`, `react`]}
                />
                <CareerTimeline />
            </Layout>
        );
    }
}

export default AboutMe;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
    }
`;
