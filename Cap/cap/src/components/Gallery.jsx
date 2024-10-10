import React from "react"

const Gallery = ({images}) => {
    return (
        <div>
            {
                images &&
                images.length > 0 ? (
                    images.map((image, index) => (
                        <li className="gallery">
                            <img className="gallery-sc" src={image}
                            alt='Screenshot'
                            width='500'/>
                        </li>
                    ))
                ) : (
                    <div>
                        <h3>No images yet!</h3>
                    </div>
                )
            }

        </div>
    )
}

export default Gallery