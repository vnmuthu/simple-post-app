import React from 'react';
import './PostList.css';
import postService from '../services/postService';

function SenderTabTitle(props) {
    return (
      props.activeSender === props.dataTab
    ? <li onClick={props.onClick} className="tab-title active-tab" data-tab={props.dataTab}>{props.title} <span className="totalPostCount">{props.dataCount}</span></li>
    : <li onClick={props.onClick} className="tab-title" data-tab={props.dataTab}>{props.title} <span className="totalPostCount">{props.dataCount}</span></li>
    )
}
  
function SenderPostContent(props) {
    return (
        <div className="post-items" style={props.style} data-tab={props.dataTab}>
            <div className="post-items-head">
                <span onClick={props.onClick} className="sort-icon">&#8593;&#8595;</span>
                <h1>{props.dataTabSender}</h1>
            </div>
            <ul>
                {
                    props.content.map((post, i) => <li key={post.id}>
                        <div className="post-time">{formatPostDate(post.created_time)}</div>
                        <div className="post-message">{post.message}</div>
                    </li>
                )}
          </ul>
        </div>
    )
}

function formatPostDate(createdDate) {
    const postedDate = new Date(createdDate);
    const postMonth = postedDate.toLocaleString('default', { month: 'long' });
    const postDay = `${postedDate.getDate()}`.padStart(2, '0');
    const postYear = postedDate.getFullYear();
    const postTime = `${postedDate.getHours()}`.padStart(2, '0') +':'+ `${postedDate.getMinutes()}`.padStart(2, '0') +':'+ postedDate.getSeconds();

    return `${postMonth} ${postDay}, ${postYear} ${postTime}`;
}

class PostList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            senderPostData : [],
            isPostsAvailable: false,
            activeSender: '',
            sortOrder: 'asc',
            searchSenderString: ''
        };

        this.changeActiveSender = this.changeActiveSender.bind(this)
        this.sortPostsByDate = this.sortPostsByDate.bind(this)
        this.handleSenderSearch = this.handleSenderSearch.bind(this)
    }

    render(){
        let { senderPostData } = this.state;
        let senderSearchText = this.state.searchSenderString.trim().toLowerCase();


        if (senderSearchText.length > 0) {
            senderPostData = this.findSender(senderSearchText);
        }

        const senderTitle = senderPostData.map((item) => 
          <SenderTabTitle key={item.id} activeSender={this.state.activeSender} onClick={this.changeActiveSender} dataTab={item.id} title={item.tabTitle} dataCount={item.tabPostCount} />
        )                                        
        const senderPostContent = senderPostData.map((item) => 
            this.state.activeSender === item.id 
            ? <SenderPostContent key={item.id} onClick={this.sortPostsByDate} dataTab={item.id} dataTabSender={item.tabTitle} content={item.tabContent} />
            : <SenderPostContent key={item.id} style={{display: 'none'}} dataTabSender={item.tabTitle} dataTab={item.id} content={item.tabContent} />
        )
        return(
          <div className="posts">
            <ul className="sender-title">
                <li className="sender-head"><span>SM</span> SuperMail</li>
                <li className="sender-search"><input type="text" name="search-sender" placeholder="Search Sender" ref="searchSender" onKeyUp={this.handleSenderSearch} /></li>
                {senderTitle}
            </ul>

            <div className="post-content">
                {senderPostContent}
            </div>
          </div>
        )
    }

    componentDidMount() {
        if (typeof this.props.location.state !== "undefined" && this.state.senderPostData.length === 0) {
            postService.fetchPosts(this.props.location.state.tokenId)
            .then((response) => {
                const { posts } = response;
                const senderData = this.groupPostsBySenderTitle(posts);

                this.setState({
                    isPostsAvailable: true,
                    senderPostData: senderData,
                    activeSender: senderData.slice(0,1).shift().id
                });

                this.refs.searchSender.focus();
            })
            .catch((error)=> {
                console.log(error);
                this.props.history.push('/login')
            })
        } else {
            console.log('Login session expired. Please login again!');
            this.props.history.push('/login')
        }
    }

    groupPostsBySenderTitle(posts) {
        let sortSenderGroup = {};
        let senderPostList = [];
        const senderGroup = posts.reduce((accumulator, currentValue) => {
              let key = currentValue.from_name;
              accumulator[key] = accumulator[key] || [];
              accumulator[key].push(currentValue);
              return accumulator;
            }, {});

        Object.keys(senderGroup).sort().forEach(function(key) {
            sortSenderGroup[key] = senderGroup[key];
        });

        senderPostList = this.transformSenderData(sortSenderGroup);

        return senderPostList;
    }

    transformSenderData(senderGroup) {
        let formattedPostGroup = [];
        if (senderGroup) {
            for (const [, postContent] of Object.entries(senderGroup)) {
                let tabItemObj = {};
                const fromName = postContent.map((i)=>i.from_name);
                const senderName = fromName.filter((item, index) => { return fromName.indexOf(item) === index });
                const userId = postContent.map((o)=>o.from_id);
                const uid = userId.filter((item, index) => { return userId.indexOf(item) === index });

                tabItemObj = {
                    id : uid.toString(),
                    tabTitle: senderName.toString(),
                    tabContent: postContent,
                    tabPostCount: postContent.length
                };
    
                formattedPostGroup.push(tabItemObj);
            }
        }

        return formattedPostGroup;
    }

    changeActiveSender(e){
        this.setState({activeSender: e.target.getAttribute("data-tab")})
    }

    sortPostsByDate() {
        let sortByOrder = 'asc';
        const { activeSender, senderPostData, sortOrder } = this.state;
        senderPostData.filter((list) => list.id === activeSender).map((group) => {
            if (sortOrder === 'asc') {
                sortByOrder = 'desc';
                return group.tabContent.sort((a, b) => new Date(a.created_time) - new Date(b.created_time))
            }

            return group.tabContent.sort((a, b) => new Date(b.created_time) - new Date(a.created_time))
        });

        this.setState({
            senderPostData: senderPostData,
            sortOrder: sortByOrder
        });
    }

    handleSenderSearch() {
        this.setState({
            searchSenderString: this.refs.searchSender.value
        });
    }

    findSender(searchText) {
        let filtersenderPostData = {};
        const { senderPostData } = this.state;

        if (searchText) {
            filtersenderPostData = senderPostData.filter((sender) => {
                return sender.tabTitle.toLowerCase().match(searchText);
            });

            return filtersenderPostData;
        }

        return senderPostData;
    }
}

export default PostList