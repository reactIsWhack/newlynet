import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import useRedirectUser from '../hooks/useRedirectUser';
import { useDispatch, useSelector } from 'react-redux';
import { selectPopup, setRenderModal } from '../app/features/popup/popupSlice';
import SiteFeatures from '../components/SiteFeatures';

const About = () => {
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
    <div className="min-h-screen flex flex-col h-full">
      <Navbar />
      <div className="hero bg-base-200 flex-1">
        <div className="hero-content text-center">
          <div className="max-w-xl ">
            <h1 className="text-xl font-bold">To fellow new students</h1>

            <div>
              <p className="text-left my-2">Hey there! </p>
              <p className="text-left">
                If you&#8217;ve found your way to NewlyNet, chances are
                you&#8217;re a new student—just like I once was.
              </p>
              <br />
              <p className="text-left">
                NewlyNet is a place where students can find others just like
                them at their school through club servers, school servers, or
                group chats.
              </p>
              <br />
              <p className="text-left">
                I hope that after using NewlyNet, you&#8217;ll feel more at ease
                and excited about your high school journey!
              </p>
              <br />
              <p className="text-left">
                Best of luck,
                <br />
                Ryan Naini
              </p>
            </div>

            <div className="flex justify-center gap-4 max-[550px]:my-3">
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
