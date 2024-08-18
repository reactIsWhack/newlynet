import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import useRedirectUser from '../hooks/useRedirectUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectPopup, setRenderModal } from '../app/features/popup/popupSlice';
import SiteFeatures from '../components/SiteFeatures';

const About = () => {
  useRedirectUser();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    renderModal: { render, name },
  } = useSelector(selectPopup);

  const openSiteFeatures = async () => {
    await dispatch(setRenderModal({ render: true, name: 'site-features' }));
    document.getElementById('my_modal_3').showModal();
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="hero bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-xl ">
            <h1 className="text-4xl font-bold">To fellow new students</h1>

            <div>
              <br />
              <p className="text-left">
                Hey there! If you&#8217;ve found your way to NewlyNet, chances
                are you&#8217;re a new student—just like I was when I first
                started. I&#8217;m Ryan, the founder of this site, and I know
                firsthand how overwhelming it can be to step into a new school
                where everything and everyone is unfamiliar.
              </p>
              <br />
              <p className="text-left">
                Before creating NewlyNet, I was the new kid at Princeton High
                School. The thought of making friends and finding my place felt
                daunting, and I worried high school would be a tough ride.
              </p>
              <br />
              <p className="text-left">
                That&#8217;s exactly why I started NewlyNet. It&#8217;s a place
                where new students like you can connect with other new students
                or existing students, whether through club servers, school
                servers, or group chats. Here, you&#8217;ll find others who are
                in the same boat, getting ready to start fresh at a new school.
              </p>
              <br />
              <p className="text-left">
                I hope that after using NewlyNet, you&#8217;ll feel more at ease
                and excited about your high school journey. Remember, school is
                meant to be a place where you thrive, not just survive.
              </p>
              <br />
              <p className="text-left">
                Best of luck,
                <br />
                Ryan Naini
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Get started
              </button>
              <button className="btn btn-neutral" onClick={openSiteFeatures}>
                Site Features
              </button>
            </div>
          </div>
        </div>
      </div>
      {render && name === 'site-features' && <SiteFeatures />}
    </div>
  );
};

export default About;
