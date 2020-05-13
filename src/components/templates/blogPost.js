import React from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import PostInfo from "components/molecules/postInfo";
import TagList from "components/molecules/tagList";
import RecentPostList from "components/organisms/recentPostList";
import Layout from "./layout";
import SEO from "../seo";
import { TwitterShareButton, TwitterIcon } from "react-share";

const PostHeader = styled.div`
    h1 {
        padding: 0;
        margin-bottom: 10px;
        border: none;
        color: ${(props) => props.theme.blogpost.title};
    }

    hr {
        margin: 20px 0 40px 0;
        background-color: ${(props) => props.theme.blogpost.hr};
    }

    div {
        color: ${(props) => props.theme.blogpost.info};
        #circle {
            background-color: ${(props) => props.theme.blogpost.info};
        }
    }
`;

const PostContent = styled.div`
    color: ${(props) => props.theme.blogpost.content.default};
    a {
        color: ${(props) => props.theme.blogpost.content.link};
        &:hover {
            text-decoration: underline;
        }
    }

    .gatsby-highlight {
        margin: 24px 0;
        border-radius: 10px;
        pre[class*="language-"] {
            padding: 10px 15px;
        }
    }

    blockquote {
        margin-left: 0;
        margin-right: 0;
        padding-left: calc(0.8125rem - 1px);
        border-left: 4px solid ${(props) => props.theme.blogpost.content.quote};
        color: ${(props) => props.theme.blogpost.content.quote};
    }

    iframe {
        margin-bottom: 0;
    }
`;

const PostFooter = styled.div`
    margin-top: 40px;

    hr {
        margin: 20px 0;
        background-color: ${(props) => props.theme.blogpost.hr};
    }
`;

const SnsShareButtons = ({ url, title }) => {
    return (
        <div>
            <TwitterShareButton
                url={url}
                title={title}
                className="mr-2"
                style={{ marginRight: 10 }}
            >
                <TwitterIcon size={40} round />
            </TwitterShareButton>
            <a
                href="https://b.hatena.ne.jp/entry/"
                class="hatena-bookmark-button"
                data-hatena-bookmark-layout="touch-counter"
                title="このエントリーをはてなブックマークに追加"
            >
                <img
                    src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png"
                    alt="このエントリーをはてなブックマークに追加"
                    width="20"
                    height="20"
                    style={{ border: "none" }}
                />
            </a>
        </div>
    );
};
class BlogPost extends React.Component {
    render() {
        const post = this.props.data.markdownRemark;
        const siteTitle = this.props.data.site.siteMetadata.title;
        const {
            title,
            date,
            category,
            tags,
            cover,
        } = this.props.data.markdownRemark.frontmatter;
        const { recent } = this.props.pageContext;
        return (
            <Layout
                location={this.props.location}
                title={siteTitle}
                activeMenu={category}
            >
                <SEO
                    title={title}
                    description={post.excerpt}
                    image={!!cover && cover.childImageSharp.fluid.src}
                    keywords={tags || []}
                />

                <PostHeader>
                    <h1>{title}</h1>
                    <PostInfo category={category} date={date} link={true} />
                    <hr />
                </PostHeader>

                <PostContent>
                    <div dangerouslySetInnerHTML={{ __html: post.html }} />
                    <SnsShareButtons
                        url={this.props.location.href}
                        title={title}
                    />
                </PostContent>

                <PostFooter>
                    <TagList data={tags} />
                    <hr />
                    {category && (
                        <RecentPostList category={category} data={recent} />
                    )}
                </PostFooter>
            </Layout>
        );
    }
}

export default BlogPost;

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!) {
        site {
            siteMetadata {
                title
                authorNickName
            }
        }
        markdownRemark(fields: { slug: { eq: $slug } }) {
            id
            excerpt(pruneLength: 160)
            html
            frontmatter {
                title
                date(formatString: "YYYY-MM-DD")
                category
                tags
                cover {
                    childImageSharp {
                        fluid(maxWidth: 500) {
                            src
                        }
                    }
                }
            }
        }
    }
`;
