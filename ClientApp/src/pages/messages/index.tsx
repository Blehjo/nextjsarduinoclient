import { ChangeEvent, Component, Dispatch, FormEvent, ReactNode } from "react";
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Send, XCircle } from "react-bootstrap-icons";
import { ConnectedProps, connect } from "react-redux";
import { HttpTransportType, HubConnectionBuilder, JsonHubProtocol, LogLevel } from '@microsoft/signalr';

import { MessageCreateStart, MessageDeleteStart, MessageFetchUserMessagesStart, MessageSetID, messageCreateStart, messageDeleteStart, messageFetchUserMessagesStart, messageSetId } from "../../store/message/message.action";
import { MessageState } from "../../store/message/message.reducer";
import { MessageCommentCreateStart, MessageCommentFetchSingleStart, MessageCommentSetID, messageCommentSetId, messagecommentCreateStart, messagecommentFetchSingleStart } from "../../store/messagecomment/messagecomment.action";
import { MessageCommentState } from "../../store/messagecomment/messagecomment.reducer";
import { MessageComment } from "../../store/messagecomment/messagecomment.types";
import { RootState } from "../../store/store";
import { Container, InputContainer, ListContainer, MessageContainer, MessageForm, TextContainer, UserTextContainer } from "../../styles/messages/messages.styles";
import { CheckUserSession, checkUserSession } from "../../store/user/user.action";

interface IMessage {
    socket: boolean;
    messageValue: string;
    messages: Array<ReactNode>;
    imageSource: string | ArrayBuffer | null | undefined;
    imageFile: any;
    connection: any;
}

type MessageProps = ConnectedProps<typeof connector>;

class Messages extends Component<MessageProps, IMessage> {
    constructor(props: any) {
        super(props);
        this.state = {
            socket: false,
            messageValue: "",
            imageSource: "",
            messages: [],
            imageFile: null,
            connection: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.showPreview = this.showPreview.bind(this);
    }
    
    handleMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { messageValue, imageFile } = this.state;
        this.props.createMessageComment(this.props.messages.messageId!, messageValue, imageFile);
        this.state.connection.send("newMessage", "foo", messageValue);
        this.state.connection.on('messageReceived', (message: any) => {
            this.props.setMessageCommentId(message.messageCommentId);
        })
        this.setState({
            ...this.state, messageValue: ""
        })
    }

    sendMessage(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        this.handleMessage(event);
    }

    handleClick(messageId: number): void {
        this.props.getMessageComments(messageId);
        this.props.setId(messageId)
    }

    handleDelete(messageId: number): void {
        this.props.deleteMessage(messageId);
    }

    handleChange(event: ChangeEvent<HTMLInputElement>): void {
        const { name, value } = event.target;
        this.setState({ ...this.state, [name]: value });
    }
    
    showPreview(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            const { files } = event.target;
            const selectedFiles = files as FileList;
            let imageFile = selectedFiles[0];
            const reader = new FileReader();
            reader.onload = x => {
            this.setState({
                ...this.state,
                imageFile,
                imageSource: x.target?.result
            });
            }
            reader.readAsDataURL(imageFile);
        } else {
            this.setState({
                ...this.state,
                imageFile: null,
                imageSource: null
            });
        }
    }

    messageFunction(prop: MessageComment) {
        const { user } = this.props;
        const { messageCommentId, messageValue, mediaLink, favorites, type, imageSource, userId } = prop;
        if (user?.userId == userId) {
            return (
                <UserTextContainer style={{ position: 'relative' }} key={messageCommentId}>
                    {messageValue}
                </UserTextContainer>
            )
        } else {
            return (
                <TextContainer style={{ position: 'relative' }} key={messageCommentId}>
                    {messageValue}
                </TextContainer>
            )
        }
    }

    handleMessageComments(message?: ReactNode): Array<ReactNode> {
        const content: Array<ReactNode> = [];
        const { messagecomments } = this.props;
        for (let i = 0; i < messagecomments.userMessagecomments.length; i++) {
            content.push(this.messageFunction(messagecomments.userMessagecomments[i]));
        }
        if (message != undefined) {
            content.push(message);
        }
        return content;
    }
    
    componentDidMount(): void {
        this.props.getMessages();
        this.props.checkUserSession();
    }

    componentDidUpdate(prevProps: Readonly<{ messages: MessageState; messagecomments: MessageCommentState; } & { getMessages: () => void; getMessageComments: (messageId: number) => void; createMessage: (messageValue: string, receiverId: string) => void; deleteMessage: (messageId: number) => void; createMessageComment: (messageId: number, messageValue: string, imageFile: File) => void; setId: (messageId: number) => void; }>, prevState: Readonly<IMessage>, snapshot?: any): void {
        if (prevProps.messages.messageId != this.props.messages.messageId) {
            this.setState({
                connection: new HubConnectionBuilder()
                .withUrl(`https://localhost:7144/hub/${this.props.messages.messageId}`)
                .withAutomaticReconnect()
                .build()
            }, () => {
                this.state.connection.start().catch((err: string) => document.write(err));
            });
        }

        if (prevProps.messagecomments.messagecommentId != this.props.messagecomments.messagecommentId) {
            this.state.connection.on('messageReceived', (message: any) => {
                this.props.getMessageComments(this.props.messages.messageId!)
            });
        }
    }

    // componentWillUnmount () {
    //     this.state.connection.stop();
    // }

    render() {
        const { messageValue } = this.state;
        return (
            <MessageContainer>
                <ListContainer>
                    <Card style={{ backgroundColor: 'black', borderRadius: '.3rem', border: 'solid 1px white', margin: '.2rem .2rem 1rem .2rem', cursor: 'pointer', color: 'white', textAlign: 'center' }}>
                        New Message +
                    </Card>
                    {
                        this.props.messages.userMessages?.map(({ messageValue, messageId, dateCreated }) => (
                            <Card onClick={() => this.handleClick(messageId)} style={{ verticalAlign: 'middle', justifyContent: 'center', borderRadius: '.3rem', border: 'solid 1px white', color: 'white', backgroundColor: 'black', margin: '.2rem .2rem 1rem .2rem', cursor: 'pointer', padding: '.5rem' }} key={messageId}>
                                <Row key={messageId} xs={2}>
                                    {/* <Col xs={4}>
                                        <Image style={{ borderRadius: '.4rem', margin: '.5rem', width: '2rem', height: '2rem', objectFit: 'cover' }} fluid src={} />
                                    </Col> */}
                                    <Col xs={10}>
                                        <div style={{ alignItems: 'center' }}>
                                            {messageValue}
                                        </div>
                                    </Col>
                                    <Col xs={2}>
                                        <XCircle onClick={() => this.handleDelete(messageId)} />
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    }
                </ListContainer>
                <MessageForm>
                    <Form onSubmit={this.sendMessage}>
                        <Container style={{ height: '75%', overflow: 'auto' }}>
                            {
                                this.handleMessageComments()
                            }
                        </Container>
                        <InputContainer>
                        <Row xs={2}>
                            <Col xs={10}>
                            <Form.Group className="mb-3" controlId="request">
                                <Form.Control style={{ height: '.5rem' }} as="textarea" onChange={this.handleChange} value={messageValue} name="messageValue" placeholder="Write a message" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formMedia">
                                <Form.Control onChange={this.showPreview} name="mediaLink" as="input" accept="image/*" type="file" placeholder="Media" />
                            </Form.Group>
                            </Col>
                            <Col xs={2}>
                            <button className="btn btn-outline-light" type="submit" ><Send/></button>
                            </Col>
                        </Row>
                        </InputContainer>
                    </Form>
                </MessageForm>
            </MessageContainer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        user: state.user.currentUser,
        messages: state.message,
        messagecomments: state.messagecomment
    }
}

const mapDispatchToProps = (dispatch: Dispatch<CheckUserSession | MessageCreateStart | MessageDeleteStart | MessageCommentCreateStart | MessageFetchUserMessagesStart | MessageCommentFetchSingleStart | MessageSetID | MessageCommentSetID>) => ({
    getMessages: () => dispatch(messageFetchUserMessagesStart()),
    getMessageComments: (messageId: number) => dispatch(messagecommentFetchSingleStart(messageId)),
    createMessage: (messageValue: string, receiverId: string) => dispatch(messageCreateStart(messageValue, receiverId)),
    deleteMessage: (messageId: number) => dispatch(messageDeleteStart(messageId)),
    createMessageComment: (messageId: number, messageValue: string, imageFile: File) => dispatch(messagecommentCreateStart(messageId, messageValue, imageFile)),
    setId: (messageId: number) => dispatch(messageSetId(messageId)),
    setMessageCommentId: (messageCommentId: number) => dispatch(messageCommentSetId(messageCommentId)),
    checkUserSession: () => dispatch(checkUserSession())
})

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Messages);