import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import QRCode from "react-qr-code"
import BottomSheetModal from "../ui/BottomSheetModal"

const HintMenu = ({ ref }: {ref: React.RefObject<BottomSheetMethods | null>}) => {
  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["75%"]}
    >
      <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}
        viewBox={"0 0 256 256"}
      />
    </BottomSheetModal>
  )
}

export default HintMenu
