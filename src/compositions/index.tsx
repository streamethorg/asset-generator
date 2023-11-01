import { Composition, Folder, Still } from 'remotion'
import { Intro, compositionSchema } from './devconnect/intro'
import { Social } from './devconnect/social'
import { MOCK_SESSION } from '../utils/mocks'

export const DEFAULT_FPS = 25
export const DevconnectISTDuration = 12 * DEFAULT_FPS
export const FtcDuration = 170

// 1 = blue/teal
// 2 = teal/orange
export const DevconnectEvents = [
  { id: 'epf-day', type: '5' }, // pink/purple
  { id: 'ethconomics', type: '4' }, // red
  { id: 'ethgn', type: '7' }, // blue
  { id: 'evm-summit', type: '3' }, // yellow/orange
  { id: 'solidity-summit', type: '6' }, // purple
]

export function Compositions() {
  return (
    <>
      <Folder name="Devconnect">
        {DevconnectEvents.map((event) => (
          <>
            <Composition
              id={event.id}
              component={Intro}
              width={1920}
              height={1080}
              durationInFrames={DevconnectISTDuration}
              fps={DEFAULT_FPS}
              schema={compositionSchema}
              defaultProps={{ ...MOCK_SESSION[0], type: event.type, id: event.id }}
            />

            <Still id={`${event.id}-social`} component={Social} width={1200} height={630} schema={compositionSchema} defaultProps={{ ...MOCK_SESSION[0], type: event.type, id: event.id }} />
          </>
        ))}
      </Folder>
    </>
  )
}
