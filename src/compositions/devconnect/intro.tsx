import { Sequence, AbsoluteFill, staticFile, Audio, useVideoConfig, useCurrentFrame, interpolate, Img, OffthreadVideo } from 'remotion'
import { loadFont } from "@remotion/google-fonts/SofiaSansExtraCondensed"
import { CreateAvatar } from '../../utils/avatars'
import dayjs from 'dayjs'
import { DEFAULT_FPS } from '..'
import { z } from 'zod'

export const { fontFamily } = loadFont()

export interface SpeakerProps {
    id: string
    name: string
    photo?: string
}

export interface SessionProps {
    name: string
    start: number,
    end: number,
    speakers: SpeakerProps[],
}

export type Props = {
    type: string
    session: SessionProps
    id: string,
}

export const compositionSchema = z.object({
    id: z.string(),
    type: z.string(),
    name: z.string(),
    start: z.number(),
    speakers: z.array(z.object({
        id: z.string(),
        name: z.string(),
        photo: z.string().optional()
    }))
})

export const Intro: React.FC<z.infer<typeof compositionSchema>> = (props) => {
    console.log('INTRO PROPS', props)
    const { durationInFrames } = useVideoConfig()
    const frame = useCurrentFrame()

    const audioFile = staticFile('devconnect/audio/IST-material-sound.mp3')
    const introFile = staticFile(`devconnect/intro/IST-intro-${props.type}.mp4`)
    const bgFile = staticFile(`devconnect/images/IST-bg-${props.type}.png`)
    const logoFile = props.id ? staticFile(`devconnect/logos/${props.id}.png`) : ''

    const introTime = 5 * DEFAULT_FPS
    const sessionTime = 7 * DEFAULT_FPS
    const fadeTime = introTime + (DEFAULT_FPS / 2)

    const logoMove = interpolate(frame, [introTime, fadeTime], [-60, 0], { extrapolateRight: "clamp" });
    const initialOpacity = interpolate(frame, [introTime, fadeTime], [0, 1]);
    const delayedOpacity = interpolate(frame, [introTime + 15, fadeTime + 15], [0, 1]);

    function titleClassName() {
        console.log('title length #', props.name)
        let className = 'w-full text-center font-bold'
        if (props.name.length >= 140) className += ' text-8xl leading-none'
        if (props.name.length > 60 && props.name.length < 140) className += ' text-8xl leading-tight'
        if (props.name.length > 40 && props.name.length < 60) className += ' text-9xl leading-tight'
        if (props.name.length < 40) className += ' text-[9rem]'

        return className
    }

    function speakersClassName() {
        console.log('# of speakers', props.speakers.length)
        let className = 'flex flex-row'
        if (props.speakers.length >= 7) className += ' gap-8'
        if (props.speakers.length > 3 && props.speakers.length < 7) className += ' gap-16'
        if (props.speakers.length <= 3) className += ' gap-24'

        return className
    }

    return (
        <AbsoluteFill>
            <Audio src={audioFile} />
            <AbsoluteFill>
                <Img style={{ width: "100%" }} src={bgFile} />
            </AbsoluteFill>

            <AbsoluteFill>
                <Sequence name='Intro video' from={0} durationInFrames={durationInFrames} layout="none">
                    <OffthreadVideo muted src={introFile} />
                </Sequence>
            </AbsoluteFill>

            <AbsoluteFill>
                <div className='flex py-12 px-24 flex-col w-full space-between justify-between text-[#252e3d]'>
                    <div className='flex relative h-32' style={{ opacity: initialOpacity }}>
                        {logoFile && (
                            <Sequence name='Logo' from={introTime} durationInFrames={sessionTime} layout="none">
                                <div className='absolute -top-4' style={{ left: logoMove, opacity: initialOpacity }}>
                                    <Img className='h-60' src={logoFile} />
                                </div>
                            </Sequence>
                        )}
                        <Sequence name='Datetime' from={introTime} durationInFrames={sessionTime} layout="none">
                            <div className='absolute top-8 right-0 flex flex-col text-right text-4xl gap-4'>
                                <span>{dayjs(props.start).format('MMMM DD, YYYY')}</span>
                                <span>Istanbul, Turkey</span>
                            </div>
                        </Sequence>
                    </div>
                    <div className='flex relative mt-8 h-96 items-end' style={{ opacity: delayedOpacity }}>
                        <Sequence name='Title' from={introTime + 10} durationInFrames={sessionTime} layout="none">
                            <h1 className={titleClassName()} style={{ fontFamily }}>{props.name}</h1>
                        </Sequence>
                    </div>
                    <div className='flex relative mt-28' style={{ opacity: delayedOpacity }}>
                        <Sequence name='Speakers' from={introTime + 10} durationInFrames={sessionTime} layout="none">
                            <div className='flex w-full justify-center items-center'>
                                <div className={speakersClassName()}>
                                    {props.speakers.map((i) => {
                                        return (
                                            <div key={i.id} className='flex flex-col items-center gap-4'>
                                                <Img className='w-48 h-48 object-cover rounded-full' src={i.photo ?? CreateAvatar(i.name)} />
                                                <span className='text-3xl font-medium w-48 text-center leading-normal'>{i.name}</span>
                                            </div>)
                                    })}
                                </div>
                            </div>
                        </Sequence>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    )
}
