import { ThreeDots } from 'react-loader-spinner'

function Loader({isFullScreen}) {
  return (
    <div className={`flex items-center justify-center ${isFullScreen && 'h-screen'}`}>
      <ThreeDots
        height="100"
        width="100"
        radius="10"
        color="#4fa94d"
        ariaLabel="three-dots-loading"
        wrapperStyle={{ margin: '20px' }}
        wrapperClass="custom-loader"
        visible={true}
      />
    </div>
  )
}

export default Loader