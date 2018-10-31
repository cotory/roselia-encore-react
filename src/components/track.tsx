import * as React from 'react'
import * as Protocol from '../rhodonite/protocols/encore'
import * as Helpers from '../rhodonite/protocols/helpers'
import {RouteComponentProps} from 'react-router'
import {HiddenText, IndentText, optionalBoolean} from './member'
import {Header, Container, Segment, Image, Divider, Grid} from 'semantic-ui-react'
import { NotFound } from './notfound';
import { TitledDocument } from 'src/rhodonite/component';
// import {cached} from '../rhodonite/utils/property'

interface TrackLocationProps {
    trackType: Protocol.TrackType
    trackId: string
}
interface TrackPageProps extends RouteComponentProps<TrackLocationProps> {
    language: Protocol.SupportedLanguages
    siteConfig: Protocol.SiteConfig
}
function getPositionByNum (x: number) {
    if (x > 10 && x < 20) return 'th'
    return ['st', 'nd', 'rd'][(x % 10) - 1] || 'th'
}
class TrackPage extends React.Component<TrackPageProps> {
    protected getCurrentTrack (): Protocol.TrackInfo | undefined {
        return undefined // Should be overloaded
    }

    // @cached
    protected findIn (ls: Protocol.TrackInfo[]) {
        const regex = /(\d+)(\w+)/
        const matchRes = regex.exec(this.props.match.params.trackId)
        if (matchRes) {
            const [_, idx, pos] = matchRes
            const intIdx = parseInt(idx, 10)
            if (getPositionByNum(intIdx) === pos.toLowerCase()) return ls.find(x => x.id === intIdx)
            return void 0
        }
        return ls.find(x => x.displayId === this.props.match.params.trackId)
    }

    private get track () {
        return this.getCurrentTrack()!
    }
    private hasValidTrack () {
        return !!this.track
    }
    private getContextText(ctx: Protocol.MultiLanguageAttribute | string) {
        return Helpers.getLanguageAttribute(ctx, this.props.language)
    }
    
    private introLayout () {
        const track = this.track
        return (
            <div>
                <Header
                as='h1'
                style={{
                    fontSize: '4em',
                    fontWeight: 'normal',
                    marginBottom: 0,
                    marginTop: '3em'
                }}
                >
                    {track.title}
                </Header>
                <Header
                as='h2'
                style={{
                    fontSize: '1.7em',
                    fontWeight: 'normal',
                    marginTop: '1.5em'
                }}
                >
                    {track.displayId ? track.displayId : `${track.id}${getPositionByNum(track.id)}${Helpers.capatialize(track.type||'')}`}@{track.releaseDate}
                </Header>
            </div>
        )
    }
    private infoLayout () {
        const getters = this.props.siteConfig.getters
        const track = this.track
        const AttrWithTitle = (p: {header: string | Protocol.MultiLanguageAttribute, children?:any, when?: boolean, indent?: boolean}) => optionalBoolean(p.when) ? (
            <div>
                <Header as='h4' style={{ fontSize: '2em' }}>
                    {this.getContextText(p.header)}
                </Header>
                <IndentText indent={p.indent}>{p.children}</IndentText>
                {/* <IndentText>
                    {p.children}
                </IndentText> */}
                <Divider hidden></Divider>
            </div>
            
        ) : (<div></div>)
        
        return (
            <Segment style={{ padding: '8em 0em' }} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                    <Grid.Column width={8}>
                        <AttrWithTitle indent={false} header={{cn: "音轨", jp:"収録内容", en:"Track"}}>
                            <ol>
                                {track.track.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ol>
                        </AttrWithTitle>
                        <AttrWithTitle when={!!track.links} indent={false} header={{cn: "链接", jp:"リンク", en: "Links"}}>
                            <ul>
                                {track.links && track.links.map((l, i) => (
                                    <li key={i}><a href={l.link}>{l.description}</a></li>
                                ))}
                            </ul>
                            
                            
                        </AttrWithTitle> 
                        {track.external && track.external.map(ex => (
                            <AttrWithTitle header={ex.title}>
                                {(ex.content instanceof Array) ? (
                                    <ul>
                                        {ex.content.map((e, idx) => (
                                            <li key={idx}><HiddenText hidden={ex.hidden}>{this.getContextText(e)}</HiddenText></li>
                                        ))}
                                    </ul>
                        ) : (<HiddenText hidden={ex.hidden}>{this.getContextText(ex.content)}</HiddenText>)}
                            </AttrWithTitle>
                        ))}
                    </Grid.Column>
                    <Grid.Column floated='right' width={8}>
                        <Image fluid bordered rounded size='massive' src={getters.trackImageGetter(track)} />
                        <Divider hidden />
                        {track.hasLimitedEdition && (
                        <Image fluid bordered rounded size='massive' src={getters.limitedTrackImageGetter(track)} />)}
                    </Grid.Column>
                    </Grid.Row>
                    
                </Grid>
            </Segment>
        )
    }
    public render() {
        const track = this.track
        if (!this.hasValidTrack()) {
            return <NotFound></NotFound>
        }
        return (
            <TitledDocument title={track.title}>
                <div style={{
                    height: "61.8vh"
                }}>
                    <Container text>
                    <div>
                        {this.introLayout()}
                    </div>
                    
                    </Container>
                </div>
                {this.infoLayout()}
                {/* <IntroLayout></IntroLayout> */}
            </TitledDocument>
        )
    }
}

export class SingleTrackPage extends TrackPage {
    protected getCurrentTrack () {
        return this.findIn(this.props.siteConfig.singles)
    }
}

export class AlbumTrackPage extends TrackPage {
    protected getCurrentTrack() {
        return this.findIn(this.props.siteConfig.albums!)
    }
}

export function customTrackPage(tp: Protocol.ExternalTrackList) {
    return class extends TrackPage {
        protected getCurrentTrack () {
            return this.findIn(tp.trackList)
        }
    }
}