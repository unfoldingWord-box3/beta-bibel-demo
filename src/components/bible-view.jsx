import React from 'react'
import { BookPreview } from "@oce-editor-tools/base"
import { usfmText } from '../constants/John.usfm.js'
import { rangeArray, arrayToObject } from '../utils/obj-functions'

const BibleView = ({curEp}) => {
  const renderFlags = {
    showTitles: true,
    showChapterLabels: true,
    showVersesLabels: true,
  };

  const getBcvFilter = (ep) => {
    const vArray = rangeArray(ep?.begin?.v,ep?.end?.v).map((val) => {
      return { inx: val }
    })
    // ToDo: This needs to be improved to also iterate through several chapters (or books)
    // currently only verses are converted to an array (no chapters and no books)
    return {
      book: { 
        jhn: {
          ch: { 
            [curEp?.begin?.ch]: { 
              v: arrayToObject(vArray,"inx")
            },
          } 
        } 
      } 
    }
  }

  const isValidEp = !!curEp?.begin?.ch && !!curEp?.begin?.v && !!curEp?.end?.v 

  const previewProps = {
    usfmText,
    bcvFilter: isValidEp ? getBcvFilter(curEp) : undefined,
    verbose: true,
  }

  
  return (
      <div key="1">
        {isValidEp && <BookPreview {...previewProps} />}
      </div>
  );
}  

export default BibleView
