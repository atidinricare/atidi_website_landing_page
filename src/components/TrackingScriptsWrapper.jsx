import { getTrackingSettings } from '@/lib/data'
import TrackingScripts from './TrackingScripts'

// Server component that fetches tracking settings and passes to client component
const TrackingScriptsWrapper = async () => {
  const tracking = await getTrackingSettings()

  return <TrackingScripts tracking={tracking} />
}

export default TrackingScriptsWrapper
