import { MovieWithRating } from "@/util/interfaces"
import { Card } from "antd"

const { Meta } = Card;

const MovieCard = (data: MovieWithRating) => {
    return (
        <Card
            hoverable
            style={{ width: 160 }}
            cover={<img alt="example" src={data.imgSrc} height={120} style={{ objectFit: 'cover' }} />}
        >
            <Meta 
                title={data.title} 
                description={
                    <div>
                        <p>{data.year}</p>
                        <p>{`${data.avgRating.toFixed(1)}, ${data.numberOfRatings}`}</p>
                    </div>
                } 
            />
        </Card>
    )
}

export default MovieCard;