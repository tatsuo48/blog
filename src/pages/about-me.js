import React from "react";
import { graphql } from "gatsby";

import Layout from "components/templates/layout";
import SEO from "components/seo";

const CareerTimeline = () => {
    return (
        <div>
            <h1>Career Timeline</h1>
            <div>
                <h2>
                    <a href="https://hamee.co.jp/">Hamee</a>
                </h2>
                <p>2020/04~現在</p>
                <ol>
                    <li>自社サービスのAWS移行</li>
                </ol>
            </div>
            <div>
                <h2>
                    <a href="https://da-vinci-studio.com/">DaVinciStudio</a>
                    (転籍)
                </h2>
                <p>2019/12~2020/03</p>
                <ol>
                    <li>kintoneで作成された顧客管理アプリケーションの改善</li>
                </ol>
            </div>
            <div>
                <h2>
                    <a href="https://www.mwed.co.jp/">みんなのウェディング</a>
                </h2>
                <p>2016/09~2019/11</p>
                <ol>
                    <li>
                        <a href="https://blog.mwed.info/posts/migration_to_aurora.html">
                            AuroraへのDB移行
                        </a>
                    </li>
                    <li>
                        <a href="https://blog.mwed.info/posts/puma_tuning.html">
                            長期休暇のときは要注意！pumaのメモリ管理をしよう
                            ~計測こそ正義~
                        </a>
                    </li>
                    <li>
                        <a href="https://blog.mwed.info/posts/infra-engineer_create_serverless-bot.html">
                            Slack + API Gateway +
                            Lambdaでサーバーレスボットを作った話
                        </a>
                    </li>
                    <li>
                        <a href="https://blog.mwed.info/posts/deploy-development-branch-fargate.html">
                            AWS Fargate を使って開発ブランチの Rails
                            アプリケーションをデプロイする
                        </a>
                    </li>
                    <li>
                        <a href="https://blog.mwed.info/posts/migrate-performance-plan.html">
                            Circle CIをPerformance Planに移行
                        </a>
                    </li>
                </ol>
            </div>
            <div>
                <h2>
                    <a href="https://www.hitachi-systems.com/">
                        日立システムズ
                    </a>
                </h2>
                <p>2014/04~2016/08</p>
                <ol>
                    <li>プライベートクラウドの運用</li>
                    <li>クラウド向け統合運用サービスの運用・基盤改善</li>
                </ol>
            </div>
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
