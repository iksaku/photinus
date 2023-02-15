import { useParams } from "solid-start";

export default function Greet() {
    const params = useParams();

    return (<p>Hello {params.name}</p>)
}