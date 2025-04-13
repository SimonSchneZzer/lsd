import Image from 'next/image';

export default function tutorial() {
    return (
        <>
            <p>
                1. Go to the following link:<br />
                <a href="https://myplan.fh-salzburg.ac.at/en/events.php" target="_blank" rel="noopener noreferrer">
                    <u>https://myplan.fh-salzburg.ac.at/en/events.php</u>
                </a>
            </p>
            <p>
                2. Scroll to the bottom of the page and click the button you see in the picture beneth.
            </p>
            <Image
                src="/images/tutorial/tut-image1.png"
                width={250}
                height={50}
                alt="Picture of the button"
            />
            <p>
                3. Copy the link that appears.
            </p>
            <p>
                4. Return to the Lazy Student Dashboard and navigate to the Course Settings page.
            </p>
            <p>
                5. Paste the copied link into the “ICS URL” field and click “Fetch Courses”.
            </p>
            <p>
                6. Review the imported values. You can correct any incorrect data if needed.
            </p>
            <p>
                7. Don’t forget to click “Save” once you’re done.
            </p>
        </>
    )
}