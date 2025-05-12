import BaseClaimView from 'components/conversations/BaseClaimView'


export default function TopClaimView(props) {
    return <BaseClaimView {...props} isTop={true} key={props.claim.id}/>
}