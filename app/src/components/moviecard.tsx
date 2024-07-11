import { MovieWithRating } from "@/util/interfaces"
import { Card, Rate } from "antd"
import { useNavigate } from "react-router-dom";
import Image from "@/components/image";

const { Meta } = Card;

const MovieCard = (data: MovieWithRating) => {
    const navigation = useNavigate();
    return (
        <Card
            hoverable
            style={{ width: 200 }}
            cover={
                <Image src={data.imgSrc as string} style={{ height: '160px'}} />
            }
            onClick={() => navigation(`/movies/${data.id}`)}
        >
            <Meta 
                title={data.title} 
                description={
                    <div>
                        <p>Year <b>{data.year}</b></p>
                        <p style={{ marginBottom: 5 }}>Views <b>{data.numberOfRatings}</b></p>
                        <Rate allowHalf disabled defaultValue={data.avgRating} />
                    </div>
                } 
            />
        </Card>
    )
}

export default MovieCard;