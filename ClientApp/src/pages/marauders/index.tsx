import { Component, Dispatch } from "react";
import { ConnectedProps, connect } from "react-redux";
import ResponsiveMemory from "../../components/responsivememory/responsivememory.component";

import { PilotFetchAllStart, PilotFetchSingleStart } from "../../store/marauder/maruader.action";
import { MessageCreateStart, MessageSetID, messageCreateStart, messageSetId } from "../../store/message/message.action";
import { MessageCommentCreateStart, messagecommentCreateStart } from "../../store/messagecomment/messagecomment.action";
import { RootState } from "../../store/store";

type MarauderProps = ConnectedProps<typeof connector>;

class Marauders extends Component<MarauderProps> {
    render() {
        return (
            <ResponsiveMemory { ...this.props }/>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return { 
        marauders: state.maruader.pilots,
        messages: state.message
    };
};

const mapDispatchToProps = (dispatch: Dispatch<PilotFetchAllStart | MessageSetID | PilotFetchSingleStart | MessageCreateStart | MessageCommentCreateStart>) => ({
	getAllMarauders: () => dispatch(marauderFetchAllStart()),
    getMarauder: (userId: number ) => dispatch(marauderFetchSingleStart(userId)),
    sendMessage: (messageValue: string) => dispatch(messageCreateStart(messageValue)),
    createMessageComment: (messageId: number, messageValue: string, mediaLink: File) => dispatch(messagecommentCreateStart(messageId, messageValue, mediaLink)),
    setId: (messageId: number) => dispatch(messageSetId(messageId))
});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Marauders);