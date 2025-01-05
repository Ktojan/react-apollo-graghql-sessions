import React, {useState} from "react";  
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const SPEAKER_FIELDS = gql`
  fragment SpeakerInfo on Speaker {
    name
    id
    bio
    sessions {
      id
      title
    }   
  }`;

const SPEAKERS = gql`
  query speakers {
    speakers {    
      ...SpeakerInfo
    }
  }
  ${SPEAKER_FIELDS}`;

export const SPEAKER_BY_ID = gql`
  query getSpeakerById($id: ID!) {
    speakerById(id: $id) {    
    ...SpeakerInfo
    }
  }  ${SPEAKER_FIELDS}`;


const SpeakerList = () => {
  const { data, loading, error } = useQuery(SPEAKERS);

  if (loading) return <h2>Loading speakers...</h2>;
  if (error) {
    console.error(error);
    return <blockquote>{error.message}</blockquote>;
  }
  console.log('Speakers ', data);

  return data.speakers.map(spkr => (
    <SpeakerDetails key={spkr.id} speaker={spkr}/>
  )
  )
};

const SpeakerDetails = ( {speaker} ) => {
  return (
    <div className="col-xs-4 speaker-item" style={{ padding: 5 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <summary>{speaker.name}</summary>
        </div>
        <div className="panel-body">
          <h5>{speaker.bio}</h5>
        </div>
      </div>
    </div>
  );
}

export const SpeakerDetailsPage = ( ) => {

  const { speaker_id } = useParams() || ''; //grabs last segment from URL

    const { loading, data, error } = useQuery(SPEAKER_BY_ID, {
        variables: { id: speaker_id}
    })
    if (loading) return <h2>Loading speaker data...</h2>;
    if (error) {
      console.error(error);
      return <blockquote>{error.message}</blockquote>;
    }
  
    const speaker = data.speakerById;

  return (
    <div className="container">
    <div className="row">
    <div className="col-xs-12" style={{ padding: 8 }}>
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">{speaker.name}</h3>
        </div>
        <div className="panel-body"> 
          <h5>{speaker.bio}</h5>
        </div>
      </div>
    </div>
    </div></div>
  );
}

export function Speakers() {
  return (
    <>
      <div className="container with-padding">
        <div className="row">
          <SpeakerList />
        </div>
      </div>
    </>
  );
}

	
