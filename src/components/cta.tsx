import { Card } from "@tremor/react";
import Image from "next/image";
import Link from "next/link";

const CTA = () => {
  return (
    <Card className="p-0 m-0 w-full sm:w-4/5 ">
      <div className="flex justify-center">
        <Image
          src="/family-loading-their-car.webp"
          alt="Logo"
          layout="responsive"
          width={150}
          height={150}
          className="object-cover rounded-t-md"
        />
      </div>
      <div className="px-6 py-4 flex flex-col items-center">
        <div className="font-bold text-xl mb-2">Hastings Direct Insurance</div>
        <p className="text-gray-700 text-base">
          Get flexible levels of car cover with a wide range of optional extras.
          <br />
          Just click below to get a quote – all done in a few minutes.
        </p>

        <div className="px-6 pt-4 pb-2">
          <Link href="/create_policy">
            <button className="bg-hastings-green hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Start your quote
            </button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default CTA;
